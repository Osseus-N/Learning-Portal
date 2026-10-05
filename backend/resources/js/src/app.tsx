import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import type { ComponentType, ReactNode } from 'react';
import { AppShell } from './components/AppShell';
import './style.css';
import './styles/app.css';

type PageComponent = ComponentType & {
    layout?: (page: ReactNode) => ReactNode;
};

type PageModule = {
    default: PageComponent;
};

const pages = import.meta.glob<PageModule>('./pages/**/*.tsx');

createInertiaApp({
    resolve: async (name) => {
        const loadPage = pages[`./pages/${name}.tsx`];

        if (!loadPage) {
            throw new Error(`Inertia page "${name}" was not found.`);
        }

        const page = await loadPage();
        page.default.layout ??= name === 'LoginPage'
            ? (content) => content
            : (content) => <AppShell>{content}</AppShell>;

        return page;
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
});
