let config = require('../../config');
let {NodeSSH} = require('node-ssh');
const ssh = new NodeSSH();

module.exports = {
    makeFolder: function(req, res, next){
    },
    // 도커 이미지 존재 여부 확인
    dockerImageCheck: async function (data, callback){
        let check_cmmd = `docker image inspect ${data.language}:${data.version}` ;
        ssh.connect(config.ssh_config).then( () => {
            ssh.execCommand(check_cmmd, {}).then(function(result) {
                console.log('ssh result => ' + result.stdout);
                console.error('ssh error => ' + result.stderr);
                if(result.stdout > 10){
                    callback(true);
                }else{
                    callback(false);
                }
            })
        })
    },
    // 리눅스 command 실행 후 callback
    execRunCallback: async function (command, callback){
        ssh.connect(config.ssh_config).then( () => {
            ssh.execCommand(command, {}).then(function(result) {
                callback(result)
            })
        })
    },
    // 도커 이미지 생성
    dockerImageBuild: async function(data){
        let build_cmmd = `docker pull ${data.language}:${data.version}`;
        await execRun(build_cmmd);
    },
    // 도커 이미지 실행
    dockerRun: async function(data){
        let run_cmmd = `docker run -d -v ${data.path}:/app --name ${data.id} -it ${data.language}:${data.version}`;
        await execRun(run_cmmd);
    },
};

// 리눅스 command 실행
async function execRun(command){
    ssh.connect(config.ssh_config).then( () => {
        ssh.execCommand(command, {}).then(function(result) {
            console.log('ssh result => ' + result.stdout);
            console.error('ssh error => ' + result.stderr);
        })
    })
}
