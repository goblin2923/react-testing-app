pipeline {
    agent any
    
    environment {
        DEV_SERVER = 'ubuntu@13.233.144.106'
        TEST_SERVER = 'ubuntu@43.204.112.13'
        APP_DIR = '/var/www/app'
        SSH_CREDENTIALS_ID = 'es2-key-pub'
        GITHUB_SSH_KEY = 'github-ssh-key'
    }
    
    stages {
        stage('Debug') {
            steps {
                script {
                    echo "Current branch is: ${env.GIT_BRANCH}"
                }
            }
        }
        
        stage('Deploy to Dev') {
            when {
                expression { 
                    return env.GIT_BRANCH == 'origin/dev' || env.BRANCH_NAME == 'dev'
                }
            }
            steps {
                script {
                    withCredentials([sshUserPrivateKey(credentialsId: env.SSH_CREDENTIALS_ID, keyFileVariable: 'SSH_KEY')]) {
                        bat """
                            icacls "%SSH_KEY%" /inheritance:r /grant:r "SYSTEM:F"
                            ssh -i "%SSH_KEY%" -o StrictHostKeyChecking=no %DEV_SERVER% "mkdir -p ~/dev && cd ~/dev && rm -rf * && git clone https://github.com/goblin2923/react-testing-app.git . && sudo docker-compose down && sudo docker-compose up --build -d"
                        """
                    }
                }
            }
        }
        
        stage('Deploy to Test') {
            when {
                expression { 
                    return env.GIT_BRANCH == 'origin/testing' || env.BRANCH_NAME == 'testing'
                }
            }
            steps {
                script {
                    withCredentials([sshUserPrivateKey(credentialsId: env.SSH_CREDENTIALS_ID, keyFileVariable: 'SSH_KEY')]) {
                        bat """
                            icacls "%SSH_KEY%" /inheritance:r /grant:r "SYSTEM:F"
                            ssh -i "%SSH_KEY%" -o StrictHostKeyChecking=no %TEST_SERVER% "mkdir -p ~/test && cd ~/test && rm -rf * && git clone -b testing https://github.com/goblin2923/react-testing-app.git . && sudo docker-compose down && sudo docker-compose up --build -d"
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