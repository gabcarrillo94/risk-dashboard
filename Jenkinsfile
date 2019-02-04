// Entornos
// UAT rama master = variacodeuser@uatceptinel.westcentralus.cloudapp.azure.com 
// QA release = ceptineluser@test-risk.westus.cloudapp.azure.com
// dev dev = ceptineluser@dev3.ceptinel.com
node {
    try {
      notifyBuild('STARTED')
      
      //stage "Variables de entorno"
      //  sh "printenv"
      
      stage "Checkout"
        git(url: 'git@bitbucket.org:variacoderisk/risk-dashboard.git', credentialsId: 'jenkins', changelog: true, branch: 'feature/lista-comentarios')

      stage "Prepare environment"
        //def environment = docker.build 'risk-dashboard'
        sh "docker build --no-cache -t risk-dashboard ."

      stage "Run environment"
        sh "docker rm -f risk-dashboard || true"
        sh "docker run -dit --net=host --name risk-dashboard -v dist:/usr/src/app/dist risk-dashboard"

      stage "Test APP"
        sh "echo 'Pending Task'"

      stage "Deliver Environment"
        sh "docker save risk-dashboard | bzip2 | ssh ceptineluser@dev3.ceptinel.com 'bunzip2 | docker load'"
        
      stage "Run remote environment"
        sh "ssh -tt ceptineluser@dev3.ceptinel.com docker rm -f risk-dashboard || true"
        sh "ssh -tt ceptineluser@dev3.ceptinel.com docker run -dit --net=host --name risk-dashboard -v /dist:/usr/src/app/dist risk-dashboard"
      
      stage "Build APP"
        sh "ssh -tt ceptineluser@dev3.ceptinel.com docker exec -it risk-dashboard gulp build"

      stage("Cleanup"){
        parallel (
          "Local Dockers" : { stage("Clean local docker") { 
                      sh "docker images -q -f dangling=true | xargs --no-run-if-empty docker rmi"
                    }; 
                  },
          // "Remote Dockers" : { stage("Clean rmeote docker") { 
          //             sh "ssh -tt ceptineluser@dev3.ceptinel.com docker images -q -f dangling=true | xargs --no-run-if-empty docker rmi"
          //           }; 
          //         }
        )
      }

      stage "Clean Workspace"
        deleteDir()
   
    } catch (e) {
      // If there was an exception thrown, the build failed
      currentBuild.result = "FAILED"
      throw e
    } finally {
      // Success or failure, always send notifications
      notifyBuild(currentBuild.result)
    }
}

// -- Método para enviar notificaciones
def notifyBuild(String buildStatus = 'STARTED') {
    // build status of null means successful
    buildStatus =  buildStatus ?: 'SUCCESSFUL'
   
    // Default values
    def colorName = 'RED'
    def colorCode = '#FF0000'
    def subject = "${buildStatus}: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'"
    def summary = "${subject} (${env.RUN_DISPLAY_URL}) "
   
    // Override default values based on build status
    if (buildStatus == 'STARTED') {
      color = 'YELLOW'
      colorCode = '#FFFF00'
    } else if (buildStatus == 'SUCCESSFUL') {
      color = 'GREEN'
      colorCode = '#00FF00'
    } else {
      color = 'RED'
      colorCode = '#FF0000'
    }
   
    // Send notifications
    slackSend (color: colorCode, message: summary)
}