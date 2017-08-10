import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import expect from 'expect';

import sendRequest from 'actions/requestActions';
import MODAL_MESSAGES from 'constants/messages';
import {
  SUCCESS,
  REGISTRATION_REQUEST,
} from 'constants/actionTypes';

const mockStore = configureMockStore([thunk]);

describe('sendRequest', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  describe('registration request', () => {
    it('should dispatch a REGISTRATION_REQUEST action', () => {
      // test user data
      const name = 'patxi';
      const mail = `test_${Date.now()}@mail.com`;
      const password = 'someEasyPw';

      // expected response
      const id = 1;
      const token = 'token';

      nock('http://localhost:3000')
        .post('/api/users', { name, mail, password })
        .reply(201, { id, token, name, mail });

      const expectedActions = [{
        type: REGISTRATION_REQUEST,
        data: { triggerId: 'registrationBtn' },
      }, {
        type: REGISTRATION_REQUEST + SUCCESS,
        msg: MODAL_MESSAGES[REGISTRATION_REQUEST],
        data: { id, token, name, mail },
      }];

      // the user data to be used on the API request must be set on the state
      const store = mockStore({
        authenticated: {
          registration: { name, mail, password },
        },
      });

      return store.dispatch(sendRequest(
        REGISTRATION_REQUEST,
        { triggerId: 'registrationBtn' },
        true
      )).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });
});
