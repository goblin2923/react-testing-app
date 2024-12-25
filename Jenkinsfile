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

        stage('Test SSH Connectivity') {
            steps {
                script {
                    echo 'Testing SSH connection to the EC2 instance...'
                    sshagent(credentials: [SSH_CREDENTIALS_ID]) {
                        echo "Connecting to: ${DEV_SERVER}"
                        echo "Running SSH command..."

                        sh '''
                        echo "Trying to SSH into ${DEV_SERVER}..."
                        ssh -v -o StrictHostKeyChecking=no ${DEV_SERVER} "echo SSH connection successful"
                        '''
                    }
                }
            }
        }



        stage('Build App on EC2') {
            steps {
                script {
                    echo 'Building the app on the EC2 instance...'
                    sshagent (credentials: [SSH_CREDENTIALS_ID]) {
                        sh '''
                        ssh -o StrictHostKeyChecking=no ${DEV_SERVER} "
                            echo 'Starting build process on ${DEV_SERVER}...' &&
                            mkdir -p ${APP_DIR} &&
                            cd ${APP_DIR} &&
                            git clone https://github.com/goblin2923/react-testing-app.git . &&
                            npm install &&
                            nohup npm run build &"
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

                        echo "Connecting to: ${DEV_SERVER}"
                        echo "SSH Command: ssh -o StrictHostKeyChecking=no ${DEV_SERVER}"
                        sh '''
                        ssh -o StrictHostKeyChecking=no ${DEV_SERVER} "echo SSH connection successful"
                        '''
                        sh '''
                            ssh -o StrictHostKeyChecking=no ${DEV_SERVER} "
                            cd ${APP_DIR} &&
                            docker-compose up -d"
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
