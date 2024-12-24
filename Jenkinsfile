pipeline {
    agent any

    environment {
        DEV_SERVER = 'ubuntu@13.233.144.106' // EC2 instance IP
        SSH_CREDENTIALS_ID = '2e49be1c-6b70-48d5-a094-b569e7afae66' // SSH credentials for AWS EC2
        APP_DIR = '/var/www/app' 
    }

    stages {
        stage('Checkout Code') {
            steps {
                // script {
                //     try {
                //         echo 'Fetching code from the dev branch...'
                //         git branch: 'dev',
                //             url: 'git@github.com:goblin2923/react-testing-app',
                //             credentialsId: 'react-github-token' 
                //     } catch (Exception e) {
                //         echo "Error during git checkout: ${e.message}"
                //     }
                // }
                checkout scm;
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    try {
                        echo 'Building Docker images...'
                        sh '''
                        docker-compose build
                        '''
                    } catch (Exception e) {
                        echo "Error during Docker build: ${e.message}"
                    }
                }
            }
        }

        stage('Deploy to Dev Environment') {
            steps {
                script {
                    try {
                        echo 'Deploying application to the Dev environment...'
                        sshagent (credentials: [SSH_CREDENTIALS_ID]) {
                            sh '''
                            ssh ${DEV_SERVER} "mkdir -p ${APP_DIR}"
                            scp -r ./build/* ${DEV_SERVER}:${APP_DIR}/
                            ssh ${DEV_SERVER} "cd ${APP_DIR} && docker-compose up -d"
                            '''
                        }
                    } catch (Exception e) {
                        echo "Error during deployment: ${e.message}"
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
