import { ipcRenderer } from 'electron';

const form = <HTMLFormElement>document.querySelector('#rpcForm');
form.addEventListener('submit', submitForm);
form.addEventListener('reset', resetForm);

function submitForm(e: Event) {
    console.log(typeof e);

    e.preventDefault();

    const newPresence: Record<string, unknown> = {};

    const children = <NodeListOf<HTMLInputElement>>form.querySelectorAll('input[type="text"]');

    children.forEach((child: HTMLInputElement) => {
        if (child.value !== '') {
            newPresence[child.id] = child.value;
        }
    });

    ipcRenderer.send('doUpdatePresence', newPresence);
}

ipcRenderer.on('asynchronous-reply', () => {
    const reply = <HTMLElement>document.querySelector('#reply');

    reply.innerHTML = 'RPC successfully set! It may take some time for the changes to appear...';

    setTimeout(() => {
        reply.innerHTML = '';
    }, 4e3);
});

function resetForm(e: Event) {
    e.preventDefault();

    ipcRenderer.send('destroyRpc');

    ipcRenderer.on('asynchronous-reply', (event, arg) => {
        const reply = <HTMLElement>document.querySelector('#reply');

        if (arg.success === true) {
            reply.innerHTML = 'Sucessfully reset the client! Redirecting to the client ID page...';
        } else {
            reply.innerHTML = `There was an error! Please manually restart the app: ${arg.error}`;
        }
    });
}
