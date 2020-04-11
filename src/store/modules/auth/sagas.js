import { toast } from 'react-toastify';
import { all, takeLatest, call, put } from 'redux-saga/effects';
import { signInSuccess, signFailure } from './actions';

import api from '~/services/api';
import history from '~/services/history';

export function* signIn({ payload }) {
  try {
    const { email, password } = payload;

    const response = yield call(api.post, 'sessions', { email, password });

    const { token, user } = response.data;

    if (!user.provider) {
      throw new Error();
    }

    yield put(signInSuccess(token, user));
    history.push('/dashboard');
  } catch (error) {
    toast.error('Falha na autenticação, verifique seus dados de acesso.');
    yield put(signFailure());
  }
}

export function* signUp({ payload }) {
  try {
    const { name, email, password } = payload;

    yield call(api.post, 'users', { name, email, password, provider: true });

    toast.success('Usuário cadastrado com sucesso.');
    history.push('/');
  } catch (error) {
    toast.error('Falha ao cadastrar, Tente novamente.');

    yield put(signFailure());
  }
}

export default all([
  takeLatest('@auth/SIGN_IN_REQUEST', signIn),
  takeLatest('@auth/SIGN_UP_REQUEST', signUp),
]);
