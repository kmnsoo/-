let config = require('../../config');

function PATH(path) {
   path = path.toString();
   path = (path.substring(0, 1) == '/') ? path.substring(1, path.length) : path;
   return path;
}
module.exports = {
   //반환값 : 로그인 전 -1, 권한 없음 0, 통과 1
   authenticate: function (req) {

      let user_authority = req.session.authority || -1;
      let req_path = PATH(req.path).split('/');
      let need_authority = -1;
      let match;

      config.policy.some(function (policy) {
         match = PATH(policy.pathway).split('/').every(function (path, index) {
            return (path == '*' || path == req_path[index]);
         });
         if (match) {
            if (policy.authority == -1) {
               need_authority = -1;
               return true;
            }
            else {
               need_authority = (policy.authority > need_authority) ? policy.authority : need_authority;
            }
         }
      });
      //권한 정의가 없는 패스: 통과
      if (need_authority == -1)
         return 1;

      //이제 권한 정의 있음
      //사용자가 로그인 하지 않은 상태
      if (user_authority == -1)
         return -1; //로그인 필요

      //패스에 권한도 정의되어 있고 사용자도 로그인 한 상태
      if (need_authority > user_authority)
         return 0; //권한 없음
      else
         return 1; //통과
   }
};