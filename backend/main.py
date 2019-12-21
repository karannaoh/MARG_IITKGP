from flask import Flask, request, send_from_directory, render_template, jsonify

import pymongo
import pdb
from bson.json_util import dumps
import pandas as pd
import plotly.graph_objects as go
import plotly
import json

from azure.cognitiveservices.vision.customvision.training import CustomVisionTrainingClient
from azure.cognitiveservices.vision.customvision.training.models import ImageFileCreateEntry
from azure.cognitiveservices.vision.customvision.prediction import CustomVisionPredictionClient
from flask_cors import CORS, cross_origin



app = Flask(__name__, static_url_path='')
app.debug = True

client = pymongo.MongoClient("mongodb://codinghackathonkgp:interiit@cluster0-shard-00-00-4jiwe.mongodb.net:27017,cluster0-shard-00-01-4jiwe.mongodb.net:27017,cluster0-shard-00-02-4jiwe.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority")
db = client['database']
usercol = db.user
govcol = db.government
repcol = db.reports
stocol = db.stories

ENDPOINT = "https://roaddetector-prediction.cognitiveservices.azure.com/"
prediction_key = "e5bf8261cdb843b787d652eb162fc00b"
project_id = "70b78bec-9ec6-4875-b119-a69e9508c9a9"
publish_iteration_name = "Iteration2"

predictor = CustomVisionPredictionClient(prediction_key, endpoint=ENDPOINT)

cors = CORS(app)
app.config['CORS_HEADERS'] = 'Access-Control-Allow-Origin'
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/')
@cross_origin()
def home():
    return render_template('index.html')

@app.route('/api/imgs/<path:path>')
@cross_origin()
def send_js(path):
    return send_from_directory('imgs', path)

@app.route('/api/')
@cross_origin()
def main():
    return "working"

@app.route('/api/get_all')
@cross_origin()
def get_all():
    govuser = govcol.find()
    reports = repcol.find()
    user = usercol.find()
    data = {"reports":reports,"govuser":govuser,"user":user}
    return dumps(data)

@app.route('/api/get_user')
@cross_origin()
def get_user():
    user = usercol.find_one({"username":"Aditya"})
    return dumps(user)

@app.route('/api/get_stat')
@cross_origin()
def get_stat():
    reporttotal = repcol.find()
    fixedreporttotal = repcol.find({"progress":"100"})
    report = repcol.find({"user":"Aditya"})
    fixedreport = repcol.find({"user":"Aditya","progress":"100"})
    data = {"total":reporttotal.count(),"fixed":fixedreporttotal.count(),"total_by_user":report.count(),"fixed_by_user":fixedreport.count()}
    return dumps(data)

@app.route('/api/get_rep_user')
@cross_origin()
def get_rep_user():
    rep = repcol.find({"user":"Aditya"})
    return dumps(rep)

@app.route('/api/get_all_reps')
@cross_origin()
def get_reports():
    data = repcol.find()
    return dumps(data)

@app.route('/api/add_rep',methods=["POST"])
@cross_origin()
def add_rep():
    data = request.get_json()
    dta={
        "user": data["name"],
        "imagefile": data["image"],
        "text": data["text"],
        "location": data["location"],
        "progress": "0",
        "approval":"0",
        "approvedBy":"",
        "sos": data["sos"]
        }
    repcol.insert_one(dta)
    return "True"

@app.route('/api/del_rep',methods=["POST"])
@cross_origin()
def del_rep():
    rep_id = request.get_json()
    repcol.delete_one({'id':rep_id})
    return "True"

@app.route('/api/getstories')
@cross_origin()
def getstories():
    data = stocol.find()
    return dumps(data)

@app.route('/api/verify_img', methods=["POST"])
@cross_origin()
def verify_img():
    import requests
    name = request.get_json()
    imgname = name["image"]
    response = requests.get(imgname)
    open('imgs/abc.png', 'wb').write(response.content)
    with open("imgs/abc.png", "rb") as image_contents:
        results = predictor.classify_image(
        project_id, publish_iteration_name, image_contents.read())
    if(results.predictions[0].tag_name == "road"):
        return "True"
    else:
        return "False"

@app.route('/map')
@cross_origin()
def update_map():

    latData=[]
    lonData=[]
    for reports in repcol.find():
        latData.append(reports['location'][0])
        lonData.append(reports['location'][1])

    graphs = [
        dict(
            data=[
                dict(
                    type='scattermapbox',
                    lat=latData,
                    lon=lonData,
                    mode='markers',
                    marker=
                        dict(
                            size=14
                        )
                ),
            ],
            layout=dict(
                title='Location of Reports',
                autosize=False,
                hovermode='closest',
                width= 1200,
                height= 800,
                mapbox=
                    dict(
                        bearing=0,
                        center=
                            dict(
                                lat=29.8543,
                                lon=77.8880
                            ),
                        pitch=0,
                        zoom=12
                    )

            )
        )
    ]
    ids = ['graph-{}'.format(i) for i, _ in enumerate(graphs)]
    graphJSON = json.dumps(graphs, cls=plotly.utils.PlotlyJSONEncoder)

    return render_template('maps.html',
                           ids=ids,
                           graphJSON=graphJSON)

@app.route('/map/json')
@cross_origin()
def update_map_json():

    latData=[]
    lonData=[]
    for reports in repcol.find():
        latData.append(reports['location'][0])
        lonData.append(reports['location'][1])

    graphs = [
        dict(
            data=[
                dict(
                    type='scattermapbox',
                    lat=latData,
                    lon=lonData,
                    mode='markers',
                    marker=
                        dict(
                            size=14
                        )
                ),
            ],
            layout=dict(
                # title='Location of Reports',
                autosize=False,
                hovermode='closest',
                width= 600,
                height= 600,

                mapbox=
                    dict(
                        bearing=0,
                        style='open-street-map',
                        center=
                            dict(
                                lat=29.875,
                                lon=77.895
                            ),
                        pitch=0,
                        zoom=12
                    )

            )
        )
    ]
    ids = ['graph-{}'.format(i) for i, _ in enumerate(graphs)]
    graphJSON = json.dumps(graphs, cls=plotly.utils.PlotlyJSONEncoder)

    return jsonify({
        'ids': ids,
        'graphJSON': graphJSON
    })

@app.route('/map/dash')
@cross_origin()
def update_map_dash():

    latData=[]
    lonData=[]
    for reports in repcol.find():
        latData.append(reports['location'][0])
        lonData.append(reports['location'][1])

    graphs = [
        dict(
            data=[
                dict(
                    type='scattermapbox',
                    lat=latData,
                    lon=lonData,
                    mode='markers',
                    marker=
                        dict(
                            size=14
                        )
                ),
            ],
            layout=dict(
                # title='Location of Reports',
                autosize=False,
                hovermode='closest',
                width= 1200,
                height= 800,

                mapbox=
                    dict(
                        bearing=0,
                        style='open-street-map',
                        center=
                            dict(
                                lat=29.8643,
                                lon=77.8880
                            ),
                        pitch=0,
                        zoom=13
                    )

            )
        )
    ]
    ids = ['graph-{}'.format(i) for i, _ in enumerate(graphs)]
    graphJSON = json.dumps(graphs, cls=plotly.utils.PlotlyJSONEncoder)

    return jsonify({
        'ids': ids,
        'graphJSON': graphJSON
    })


@app.route('/api/progress_update',methods=["POST"])
@cross_origin()
def progress_update():
    data = request.get_json()
    reportid = data["id"]
    progress = data["progress"]
    repcol.update({"id":reportid}, { "$set":{"progress": progress }})
    return 'true'

@app.route('/api/approve_status',methods=["POST"])
@cross_origin()
def approve_status():
    data = request.get_json()
    reportid = data["id"]
    status = data["status"]
    repcol.update({"id":reportid}, { "$set":{"approval": status }})
    return 'true'

@app.route('/map1')
@cross_origin()
def map1():
    latData=[]
    lonData=[]
    for reports in repcol.find():
        latData.append(reports['location'][0])
        lonData.append(reports['location'][1])

    graphs = [
        dict(
            data=[
                dict(
                    type='scattermapbox',
                    lat=latData,
                    lon=lonData,
                    mode='markers',
                    marker=
                        dict(
                            size=14
                        )
                ),
            ],
            layout=dict(
                # title='Location of Reports',
                autosize=False,
                hovermode='closest',
                width= 1200,
                height= 800,

                mapbox=
                    dict(
                        bearing=0,
                        style='open-street-map',
                        center=
                            dict(
                                lat=29.8643,
                                lon=77.8880
                            ),
                        pitch=0,
                        zoom=13
                    )

            )
        )
    ]
    ids = ['graph-{}'.format(i) for i, _ in enumerate(graphs)]
    graphJSON = json.dumps(graphs, cls=plotly.utils.PlotlyJSONEncoder)

    return render_template('blankmap.html',
                           ids=ids,
                           graphJSON=graphJSON)


@app.route('/map2')
@cross_origin()
def map2():
    latData=[]
    lonData=[]
    for reports in repcol.find():
        latData.append(reports['location'][0])
        lonData.append(reports['location'][1])

    graphs = [
        dict(
            data=[
                dict(
                    type='scattermapbox',
                    lat=latData,
                    lon=lonData,
                    mode='markers',
                    marker=
                        dict(
                            size=14
                        )
                ),
            ],
            layout=dict(
                # title='Location of Reports',
                autosize=False,
                hovermode='closest',
                width= 600,
                height= 600,

                mapbox=
                    dict(
                        bearing=0,
                        style='open-street-map',
                        center=
                            dict(
                                lat=29.875,
                                lon=77.895
                            ),
                        pitch=0,
                        zoom=13
                    )

            )
        )
    ]
    ids = ['graph-{}'.format(i) for i, _ in enumerate(graphs)]
    graphJSON = json.dumps(graphs, cls=plotly.utils.PlotlyJSONEncoder)

    return render_template('blankmap.html',
                           ids=ids,
                           graphJSON=graphJSON)


@app.route('/api/get_roads')
@cross_origin()
def get_roads():
    data = [{"name": 'Thomasan Marg',"locality": 'IIT Roorkee',"reports": 4},{"name": 'Hydrology Road',"locality": 'IIT Roorkee',"reports": 2},{"name": 'Jadugar Road',"locality": 'Civil Lines',"reports": 1},{"name": 'NH344',"locality": 'Lal Kurti Cantonement',"reports": 1},{"name": 'Azad Road',"locality": 'IIT Roorkee',"reports": 1}]
    return jsonify(data)

@app.route('/map3')
@cross_origin()
def map3():
    latData=[]
    lonData=[]
    for reports in repcol.find():
        latData.append(reports['location'][0])
        lonData.append(reports['location'][1])

    graphs = [
        dict(
            data=[
                dict(
                    type='scattermapbox',
                    lat=latData,
                    lon=lonData,
                    mode='markers',
                    marker=
                        dict(
                            size=14
                        ),
                    text=["Anshuman Chakravarty","Karan Pratap Singh","Aditya Vikram Singh",
                    "Aditya Vikram Singh"]
                ),
            ],
            layout=dict(
                # title='Location of Reports',
                autosize=False,
                hovermode='closest',
                width= 1000,
                height= 1200,

                mapbox=
                    dict(
                        bearing=0,
                        style='open-street-map',
                        center=
                            dict(
                                lat=29.863,
                                lon=77.915
                            ),
                        pitch=0,
                        zoom=13
                    )

            )
        )
    ]
    ids = ['graph-{}'.format(i) for i, _ in enumerate(graphs)]
    graphJSON = json.dumps(graphs, cls=plotly.utils.PlotlyJSONEncoder)

    return render_template('blankmap.html',
                           ids=ids,
                           graphJSON=graphJSON)

if __name__ == '__main__':
    app.run()
