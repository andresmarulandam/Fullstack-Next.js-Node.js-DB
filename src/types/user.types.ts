export interface ReqResUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

export interface ReqResResponse {
  data: ReqResUser;
  support?: any;
}
