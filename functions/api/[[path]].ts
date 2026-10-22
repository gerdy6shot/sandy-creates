import { handleApi, type ServerConfig } from '../../server/api';
export const onRequest = ({request,env}:{request:Request;env:ServerConfig}) => handleApi(request,env);
