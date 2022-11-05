import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from '@/globals/store';
import '@/assets/styles/normalize.scss';
import HomeApp from './HomeApp';

createRoot(document.getElementById('root') as HTMLElement).render(
    <StrictMode>
        <Provider store={store}>
            <HomeApp />
        </Provider>
    </StrictMode>,
);
