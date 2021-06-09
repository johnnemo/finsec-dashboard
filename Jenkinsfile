def label = "dind-${UUID.randomUUID().toString()}"

podTemplate(label: label, yaml: """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: docker-cmds
    image: docker:18.09.6
    resources: 
      requests: 
        cpu: 100m 
        memory: 512Mi
    env: 
      - name: DOCKER_HOST 
        value: tcp://localhost:2375    
    tty: true
  - name: dind-daemon
    image: docker:18.09.6-dind
    resources: 
      requests:
        cpu: 100m 
        memory: 512Mi
    tty: true
    securityContext:
      privileged: true
    volumeMounts:
      - name: docker-graph-storage
        mountPath: /var/lib/docker
  volumes: 
      - name: docker-graph-storage 
        emptyDir: {}
"""
  ) {

/* Slack notify integration */


def notifyBuild = { String buildStatus ->
   // Build status of null means success.
    buildStatus = buildStatus ?: 'SUCCESS'

    def color

    if (buildStatus == 'STARTED') {
        color = '#D4DADF'
    } else if (buildStatus == 'SUCCESS') {
        color = '#BDFFC3'
    } else if (buildStatus == 'UNSTABLE') {
        color = '#FFFE89'
    } else {
        color = '#FF9FA1'
    }

    def msg = "${buildStatus}: `${env.JOB_NAME}` #${env.BUILD_NUMBER}:\n${env.BUILD_URL}"

 slackSend(baseUrl: 'https://finseceuproject.slack.com/services/hooks/jenkins-ci/', channel: '#cicd', color: color, message: msg, token: 'Ww7nFtLmhZj7i3KCAiQDKl5e') 
}


node(label) {
    def cloneRepo = checkout scm
    def image = "dashboard:latest"
    def gitCommit = cloneRepo.GIT_COMMIT
    def gitBranch = cloneRepo.GIT_BRANCH
    def dockerFinsec = "registry.finsec-project.eu"
    def registryFinsec = "https://registry.finsec-project.eu"
        try {
        notifyBuild('STARTED') 

stage('Clone repository') {
        checkout scm
    }
stage('Build docker') {
        try{
          container('docker-cmds') {
         sh """
         docker build -t ${dockerFinsec}/${image} .
         """

            }
      }
        catch (exc) {
        println "Failed to test - ${currentBuild.fullDisplayName}"
        throw(exc)
         }  
}
stage('Push Docker images') {
      container('docker-cmds') {
        withCredentials([[$class: 'UsernamePasswordMultiBinding',
          credentialsId: 'jenkins',
          usernameVariable: 'JENKINS_USER',
          passwordVariable: 'JENKINS_PASSWORD']]) {
          sh """
            echo ${gitCommit}
            docker image ls
            docker login -u ${JENKINS_USER} -p ${JENKINS_PASSWORD} ${registryFinsec}
            docker push ${dockerFinsec}/${image}
            """
        }
      }
   } 
}catch (e) {
         currentBuild.result = "FAILED"
         throw e
           }
finally {
            // Success or failure, always send notifications
            notifyBuild(currentBuild.result) 
        }
 }
}
