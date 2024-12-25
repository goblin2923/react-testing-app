pipeline {
    agent any

    environment {
        DEV_SERVER = 'ubuntu@13.233.144.106'
        SSH_CREDENTIALS_ID = 'es2-key-pub'
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
                            icacls "%SSH_KEY%" /inheritance:r /grant:r "SYSTEM:F"
                            rem Test SSH connection
                            ssh -i "%SSH_KEY%" -o StrictHostKeyChecking=no ${env.DEV_SERVER} "echo SSH connection successful"
                        """
                    }
                }
            }
        }

        stage('Build App on EC2') {
            steps {
                script {
                    try{
                    echo 'Building the app on the EC2 instance...'
                    withCredentials([sshUserPrivateKey(credentialsId: 'github-ssh-key', keyFileVariable: 'GITHUB_SSH_KEY')]) {
                        bat """
                            icacls "%SSH_KEY%" /inheritance:r /grant:r "SYSTEM:F"
                            rem Build app on EC2
                            ssh -i "%SSH_KEY%" -o StrictHostKeyChecking=no ${env.DEV_SERVER} "
                                mkdir -p ${env.APP_DIR} &&
                                cd ${env.APP_DIR} &&
                                git config --global core.sshCommand 'ssh -i ${GITHUB_SSH_KEY} -o StrictHostKeyChecking=no' &&
                                git clone git@github.com:goblin2923/react-testing-app.git . &&
                                npm install &&
                                npm run build
                            "
                        """
                    }
                    }
                    catch (Exception e) {
                    error "Docker build failed: ${e.getMessage()}"
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
                            icacls "%SSH_KEY%" /inheritance:r /grant:r "SYSTEM:F"
                            rem Deploy app on EC2
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
