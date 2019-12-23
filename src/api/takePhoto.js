import request from "@/utils/request";
import cfg from "@/config/config";

const takePhoto = {
  //根据工号查询员工
  getUserInfoByUserNo: param => {
    return request("post", cfg.apiUrl + "api/user/face/getUserInfoByUserNo", param);
  },
};
export default takePhoto;
