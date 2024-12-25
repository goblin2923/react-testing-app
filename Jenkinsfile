pipeline {
    agent any

    environment {
        DEV_SERVER = 'ubuntu@13.233.144.106'
        SSH_CREDENTIALS_ID = 'ubuntu' // Matched to the credential ID from the logs
        APP_DIR = '/var/www/app'
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Test SSH Connectivity') {
            steps {
                script {
                    echo 'Testing SSH connection to the EC2 instance...'
                    withCredentials([sshUserPrivateKey(credentialsId: env.SSH_CREDENTIALS_ID, keyFileVariable: 'SSH_KEY')]) {
                        bat """
                            ssh -i "%SSH_KEY%" -o StrictHostKeyChecking=no ${env.DEV_SERVER} "echo SSH connection successful"
                        """
                    }
                }
            }
        }

        stage('Build App on EC2') {
            steps {
                script {
                    echo 'Building the app on the EC2 instance...'
                    withCredentials([sshUserPrivateKey(credentialsId: env.SSH_CREDENTIALS_ID, keyFileVariable: 'SSH_KEY')]) {
                        bat """
                            ssh -i "%SSH_KEY%" -o StrictHostKeyChecking=no ${env.DEV_SERVER} "mkdir -p ${env.APP_DIR} && cd ${env.APP_DIR} && git clone https://github.com/goblin2923/react-testing-app.git . && npm install && npm run build"
                        """
                    }
                }
            }
        }

        stage('Deploy App on EC2') {
            steps {
                script {
                    echo 'Deploying the app on the EC2 instance...'
                    withCredentials([sshUserPrivateKey(credentialsId: env.SSH_CREDENTIALS_ID, keyFileVariable: 'SSH_KEY')]) {
                        bat """
                            ssh -i "%SSH_KEY%" -o StrictHostKeyChecking=no ${env.DEV_SERVER} "cd ${env.APP_DIR} && docker-compose up -d"
                        """
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