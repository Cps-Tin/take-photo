const devUrl = 'http://192.168.2.2:9090/';
const proUrl = 'http://121.40.101.29:8080/';
export default {
  apiUrl: process.env.NODE_ENV === 'production' ? proUrl : devUrl
}
