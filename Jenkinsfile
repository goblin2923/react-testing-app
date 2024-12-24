pipeline {
    agent any

    environment {
        DEV_SERVER = 'ubuntu@13.233.144.106'
        SSH_CREDENTIALS_ID = '2e49be1c-6b70-48d5-a094-b569e7afae66'
        APP_DIR = '/var/www/app'
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    echo 'Building Docker images...'
                    sh '''
                    if ! command -v docker-compose &> /dev/null; then
                        echo "docker-compose not found!"
                        exit 1
                    fi
                    docker-compose build
                    '''
                }
            }
        }

        stage('Deploy to Dev Environment') {
            steps {
                script {
                    echo 'Deploying application to the Dev environment...'
                    sshagent (credentials: [SSH_CREDENTIALS_ID]) {
                        sh '''
                        ssh ${DEV_SERVER} "mkdir -p ${APP_DIR}"
                        scp -r ./build/* ${DEV_SERVER}:${APP_DIR}/
                        ssh ${DEV_SERVER} "cd ${APP_DIR} && docker-compose up -d"
                        '''
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Deployment to Dev environment succeeded!'
        }
        failure {
            echo 'Deployment to Dev environment failed.'
        }
    }
}
