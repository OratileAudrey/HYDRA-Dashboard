import { hydraApi } from '@/plugins/hydra';
import qs from 'qs';
import type { TokenResponse } from '@/types/auth';

export async function loginUser(username: string, password: string): Promise<TokenResponse> {
  const data = qs.stringify({
    client_id: 'ro.client',
    client_secret: 'secret',
    grant_type: 'password',
    scope: 'api1',
    username,
    password,
  });

  const response = await hydraApi.post<TokenResponse>('/connect/token', data);
  return response.data;
}
