pipeline {
    agent any

    environment {
        DEV_SERVER = 'ubuntu@13.233.144.106' // EC2 instance IP
        SSH_CREDENTIALS_ID = '2e49be1c-6b70-48d5-a094-b569e7afae66' // SSH credentials for AWS EC2
        APP_DIR = '/var/www/app' // Deployment directory on EC2
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build App on EC2') {
            steps {
                script {
                    echo 'Building the app on the EC2 instance...'
                    sshagent (credentials: [SSH_CREDENTIALS_ID]) {
                        sh '''
                        ssh ${DEV_SERVER} "
                            mkdir -p ${APP_DIR} &&
                            cd ${APP_DIR} &&
                            git clone https://github.com/goblin2923/react-testing-app.git . &&
                            npm install &&
                            nohup npm run build &
                        "
                        '''
                    }
                }
            }
        }

        stage('Deploy App on EC2') {
            steps {
                script {
                    echo 'Deploying the app on the EC2 instance...'
                    sshagent (credentials: [SSH_CREDENTIALS_ID]) {
                        sh '''
                        ssh ${DEV_SERVER} "
                            cd ${APP_DIR} &&
                            docker-compose up -d
                        "
                        '''
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Build and deployment succeeded!'
        }
        failure {
            echo 'Build or deployment failed.'
        }
    }
}
