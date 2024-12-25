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
        
        // stage('Install Required Tools') {
        //     steps {
        //         script {
        //             echo 'Installing required tools on the Jenkins server...'
        //             sh 'sudo apt-get update'
        //             sh 'sudo apt-get install -y npm'
        //             sh 'sudo apt-get install -y docker.io'
        //             sh 'sudo apt-get install -y docker-compose'
        //         }
        //     }
        // }
        stage('Validate Environment') {
            steps {
                script {
                    echo 'Validating deployment environment...'
                    sshagent(credentials: [env.SSH_CREDENTIALS_ID]) {
                        sh """
                            ssh -o StrictHostKeyChecking=no ${env.DEV_SERVER} '
                                command -v npm >/dev/null 2>&1 || { echo "npm is required but not installed" >&2; exit 1; }
                                command -v docker >/dev/null 2>&1 || { echo "docker is required but not installed" >&2; exit 1; }
                                command -v docker-compose >/dev/null 2>&1 || { echo "docker-compose is required but not installed" >&2; exit 1; }
                            '
                        """
                    }
                }
            }
        }
        
        stage('Test SSH Connectivity') {
            steps {
                script {
                    echo 'Testing SSH connection to the EC2 instance...'
                    sshagent(credentials: [env.SSH_CREDENTIALS_ID]) {
                        sh """
                            ssh -o StrictHostKeyChecking=no ${env.DEV_SERVER} 'echo SSH connection successful'
                        """
                    }
                }
            }
        }



        stage('Build App on EC2') {
            steps {
                script {
                    echo 'Building the app on the EC2 instance...'
                    sshagent(credentials: [env.SSH_CREDENTIALS_ID]) {
                        sh """
                            ssh -o StrictHostKeyChecking=no ${env.DEV_SERVER} '
                                mkdir -p ${env.APP_DIR}
                                cd ${env.APP_DIR}
                                git clone https://github.com/goblin2923/react-testing-app.git .
                                npm install
                                npm run build
                            '
                        """
                    }
                }
            }
        }

        stage('Deploy App on EC2') {
            steps {
                script {
                    echo 'Deploying the app on the EC2 instance...'
                    sshagent(credentials: [env.SSH_CREDENTIALS_ID]) {
                        sh """
                            ssh -o StrictHostKeyChecking=no ${env.DEV_SERVER} '
                                cd ${env.APP_DIR}
                                docker-compose up -d
                            '
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
