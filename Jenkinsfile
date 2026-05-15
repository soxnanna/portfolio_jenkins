pipeline {
    agent any

    environment {
        BACKEND_IMAGE  = "portfolio-backend"
        FRONTEND_IMAGE = "portfolio-frontend"
    }

    stages {

        // ─────────────────────────────────────────────
        // STAGE 1 — Cloner le dépôt GitHub
        // ─────────────────────────────────────────────
        stage('Clone Repository') {
            steps {
                git branch: 'main',
                    credentialsId: 'github_creds',
                    url: 'https://github.com/soxnanna/portfolio_jenkins.git'
            }
        }

        // ─────────────────────────────────────────────
        // STAGE 2 — Build image Docker Backend
        // ─────────────────────────────────────────────
        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh 'docker build -t $BACKEND_IMAGE .'
                }
            }
        }

        // ─────────────────────────────────────────────
        // STAGE 3 — Build image Docker Frontend
        // ─────────────────────────────────────────────
        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'docker build -t $FRONTEND_IMAGE .'
                }
            }
        }

        // ─────────────────────────────────────────────
        // STAGE 4 — Déploiement avec Docker Compose
        // Récupère le fichier .env depuis les credentials Jenkins
        // ─────────────────────────────────────────────
        stage('Start Containers') {
            steps {
                withCredentials([file(credentialsId: 'portfolio-env', variable: 'ENV_FILE')]) {
                    sh 'cp $ENV_FILE .env'
                    sh 'docker compose down'
                    sh 'docker compose --env-file .env up -d'
                    sh 'rm -f .env'
                }
            }
        }

        // ─────────────────────────────────────────────
        // STAGE 5 — Vérification des conteneurs actifs
        // ─────────────────────────────────────────────
        stage('Verify Containers') {
            steps {
                sh 'docker ps'
            }
        }
    }

    // ─────────────────────────────────────────────
    // POST — Notifications email
    // ─────────────────────────────────────────────
    post {
        success {
            echo 'Déploiement réussi !'
            emailext (
                subject: "✅ SUCCESS: Pipeline ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """
                    <h2 style="color:green;">✅ Pipeline réussi !</h2>
                    <p><b>Job :</b> ${env.JOB_NAME}</p>
                    <p><b>Build :</b> #${env.BUILD_NUMBER}</p>
                    <p><b>Durée :</b> ${currentBuild.durationString}</p>
                    <p>Backend + Frontend déployés avec succès via Docker Compose.</p>
                    <p><a href="${env.BUILD_URL}">Voir les logs Jenkins</a></p>
                """,
                to: "soxnanna@gmail.com",
                mimeType: 'text/html'
            )
        }
        failure {
            echo 'Pipeline échoué !'
            emailext (
                subject: "❌ FAILURE: Pipeline ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """
                    <h2 style="color:red;">❌ Pipeline échoué !</h2>
                    <p><b>Job :</b> ${env.JOB_NAME}</p>
                    <p><b>Build :</b> #${env.BUILD_NUMBER}</p>
                    <p><b>Durée :</b> ${currentBuild.durationString}</p>
                    <p>Vérifiez les logs Jenkins pour identifier l'erreur.</p>
                    <p><a href="${env.BUILD_URL}">Voir les logs Jenkins</a></p>
                """,
                to: "soxnanna@gmail.com",
                mimeType: 'text/html'
            )
        }
    }
}
