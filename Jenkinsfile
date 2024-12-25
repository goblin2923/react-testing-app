pipeline {
    agent any

    environment {
        DEV_SERVER = 'ubuntu@13.233.144.106'
        SSH_CREDENTIALS_ID = 'ubuntu'
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
                        // First, create a temporary copy of the key with correct permissions
                        bat """
                            echo Creating secure key file...
                            copy /Y "%SSH_KEY%" ssh_key.tmp
                            icacls ssh_key.tmp /inheritance:r
                            icacls ssh_key.tmp /grant:r "%USERNAME%":R
                            ssh -v -i "ssh_key.tmp" -o StrictHostKeyChecking=no ${env.DEV_SERVER} "echo SSH connection successful"
                            del ssh_key.tmp
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
                            echo Creating secure key file...
                            copy /Y "%SSH_KEY%" ssh_key.tmp
                            icacls ssh_key.tmp /inheritance:r
                            icacls ssh_key.tmp /grant:r "%USERNAME%":R
                            ssh -i "ssh_key.tmp" -o StrictHostKeyChecking=no ${env.DEV_SERVER} "mkdir -p ${env.APP_DIR} && cd ${env.APP_DIR} && git clone https://github.com/goblin2923/react-testing-app.git . && npm install && npm run build"
                            del ssh_key.tmp
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
                            echo Creating secure key file...
                            copy /Y "%SSH_KEY%" ssh_key.tmp
                            icacls ssh_key.tmp /inheritance:r
                            icacls ssh_key.tmp /grant:r "%USERNAME%":R
                            ssh -i "ssh_key.tmp" -o StrictHostKeyChecking=no ${env.DEV_SERVER} "cd ${env.APP_DIR} && docker-compose up -d"
                            del ssh_key.tmp
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
            
            // Clean up any temporary key files in case of failure
            script {
                bat "if exist ssh_key.tmp del ssh_key.tmp"
            }
        }
    }
}