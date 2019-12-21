import React from 'react';
import useForm from 'react-hook-form';

export default function Login({ loginUser }) {
  const { handleSubmit, register, setError, errors } = useForm();
  const onSubmit = values => {
    let value = loginUser(values.username, values.password);
    if (value === false) {
      setError('Wrong username/password!');
    }
  };

  let error = errors.login ? 'error' : '';

  return (
    <div className={'login ' + error}>
      <div className='card'>
        <h1 className='title'>Login</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            name='username'
            ref={register({
              required: true
            })}
          />

          <input
            name='password'
            type='password'
            ref={register({
              required: true
            })}
          />

          {errors.login ? <p className='error'>{errors.login.message}</p> : ''}
          <button type='submit'>Submit</button>
        </form>
      </div>
    </div>
  );
}
