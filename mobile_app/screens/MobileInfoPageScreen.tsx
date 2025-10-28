// mobile_app/screens/MobileInfoPageScreen.tsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';

const pageContent: { [key: string]: { title: string; content: React.ReactNode } } = {
    'about-us': {
        title: 'À propos de InvestMaroc',
        content: (
            <>
                <p>InvestMaroc est la première plateforme de financement participatif au Maroc, dédiée à connecter des investisseurs visionnaires avec des entrepreneurs marocains talentueux.</p>
                <p>Notre mission est de démocratiser l'investissement et de catalyser la croissance économique en soutenant des projets innovants qui façonnent l'avenir du pays.</p>
            </>
        ),
    },
    'privacy': {
        title: 'Politique de confidentialité',
        content: <p>Votre vie privée est importante pour nous. Cette politique explique quelles données nous collectons et comment nous les utilisons. [Texte de la politique de confidentialité à ajouter ici]</p>,
    },
    'terms': {
        title: "Conditions d'utilisation",
        content: <p>En utilisant notre application, vous acceptez nos conditions d'utilisation. [Texte des conditions d'utilisation à ajouter ici]</p>,
    },
    'contact': {
        title: 'Contactez-nous',
        content: (
            <>
                <p>Pour toute question ou assistance, veuillez nous contacter à l'adresse suivante :</p>
                <p className="font-semibold text-primary">support@investmaroc.com</p>
            </>
        ),
    },
};

const MobileInfoPageScreen = () => {
    const { page } = useParams<{ page: string }>();
    const content = page ? pageContent[page] : null;

    if (!content) {
        return (
            <div className="p-4 text-center">
                <p>Page non trouvée.</p>
                <Link to="/mobile/about" className="text-primary mt-4 inline-block">Retour</Link>
            </div>
        );
    }

    return (
        <div className="p-4">
            <div className="bg-white dark:bg-card-dark p-6 rounded-lg shadow-sm">
                <h1 className="text-2xl font-bold mb-4 text-text-light dark:text-text-dark">{content.title}</h1>
                <div className="prose prose-sm dark:prose-invert max-w-none space-y-4 text-gray-700 dark:text-gray-300">
                    {content.content}
                </div>
            </div>
        </div>
    );
};

export default MobileInfoPageScreen;
