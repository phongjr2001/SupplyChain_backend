import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { store, persistor } from './app/store'
import { ContextProvider } from './contexts/ContextProvider';
import { BrowserRouter } from 'react-router-dom'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
   <React.StrictMode>
      <Provider store={store}>
         <PersistGate loading={null} persistor={persistor}>
            <ContextProvider>
               <BrowserRouter>
                  <App />
               </BrowserRouter>
            </ContextProvider>
         </PersistGate>
      </Provider>
   </React.StrictMode>
);
