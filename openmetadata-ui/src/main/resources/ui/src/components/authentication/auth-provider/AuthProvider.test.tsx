/*
 *  Copyright 2023 Collate.
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *  http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
import {
  act,
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AppState from 'AppState';
import React from 'react';
import AuthProvider, { useAuthContext } from './AuthProvider';

jest.mock('react-router-dom', () => ({
  useHistory: jest.fn().mockReturnValue({ push: jest.fn(), listen: jest.fn() }),
  useLocation: jest.fn().mockReturnValue({ pathname: 'pathname' }),
}));

jest.mock('rest/miscAPI', () => ({
  fetchAuthenticationConfig: jest
    .fn()
    .mockImplementation(() => Promise.resolve()),
  fetchAuthorizerConfig: jest.fn().mockImplementation(() => Promise.resolve()),
}));

jest.mock('rest/userAPI', () => ({
  getLoggedInUser: jest.fn().mockImplementation(() => Promise.resolve()),
  updateUser: jest.fn().mockImplementation(() => Promise.resolve()),
}));

describe('Test auth provider', () => {
  it('Logout handler should call the "updateUserDetails" method', async () => {
    const mockUpdateUserDetails = jest.spyOn(AppState, 'updateUserDetails');
    const ConsumerComponent = () => {
      const { onLogoutHandler } = useAuthContext();

      return (
        <button data-testid="logout-button" onClick={onLogoutHandler}>
          Logout
        </button>
      );
    };

    render(
      <AuthProvider childComponentType={ConsumerComponent}>
        <ConsumerComponent />
      </AuthProvider>
    );

    await waitForElementToBeRemoved(() => screen.getByTestId('loader'));

    const logoutButton = screen.getByTestId('logout-button');

    expect(logoutButton).toBeInTheDocument();

    await act(async () => {
      userEvent.click(logoutButton);
    });

    expect(mockUpdateUserDetails).toHaveBeenCalled();
    expect(mockUpdateUserDetails).toHaveBeenCalledWith({});
  });
});
