pipeline {
    agent any
    
    environment {
        DEV_SERVER = 'ubuntu@13.233.144.106'
        TEST_SERVER = 'ubuntu@43.204.112.13'
        APP_DIR = '/var/www/app'
        SSH_CREDENTIALS_ID = 'EC2-SSH-KEY'
    }
    
    stages {
        stage('Deploy to Dev') {
            when {
                branch 'dev'
            }
            steps {
                script {
                    withCredentials([sshUserPrivateKey(credentialsId: env.SSH_CREDENTIALS_ID, keyFileVariable: 'SSH_KEY')]) {
                        bat """
                            icacls "%SSH_KEY%" /inheritance:r /grant:r "SYSTEM:F"
                            ssh -i "%SSH_KEY%" -o StrictHostKeyChecking=no %DEV_SERVER% "cd ~ && rm -rf react-testing-app && git clone https://github.com/goblin2923/react-testing-app.git && cd react-testing-app && sudo docker-compose down && sudo docker-compose up --build -d"
                        """
                    }
                }
            }
        }
        
        stage('Deploy to Test') {
            when {
                branch 'testing'
            }
            steps {
                script {
                    withCredentials([sshUserPrivateKey(credentialsId: env.SSH_CREDENTIALS_ID, keyFileVariable: 'SSH_KEY')]) {
                        bat """
                            icacls "%SSH_KEY%" /inheritance:r /grant:r "SYSTEM:F"
                            ssh -i "%SSH_KEY%" -o StrictHostKeyChecking=no %TEST_SERVER% "cd ~ && rm -rf react-testing-app && git clone -b testing https://github.com/goblin2923/react-testing-app.git && cd react-testing-app && sudo docker-compose down && sudo docker-compose up --build -d"
                        """
                    }
                }
            }
        }
    }
    
    post {
        failure {
            echo 'Build or deployment failed.'
        }
    }
}