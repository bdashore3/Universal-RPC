import { ipcRenderer, shell } from 'electron';

document?.addEventListener('click', handleClick);

function handleClick(event: MouseEvent) {
    const target = event.target as HTMLAnchorElement;

    if (target.tagName === 'A' && target.href.startsWith('http')) {
        event.preventDefault();
        shell.openExternal(target.href);
    }
}

const form = <HTMLFormElement>document.querySelector('form');
form.addEventListener('submit', submitForm);

function submitForm(e: Event) {
    e.preventDefault();

    const clientId = (<HTMLInputElement>document.querySelector('#clientId')).value;
    ipcRenderer.send('clientId:value', clientId);

    ipcRenderer.on('asynchronous-reply', (event, arg) => {
        const replyDiv = <HTMLElement>document.querySelector('#reply');

        if (arg.success === true) {
            replyDiv.innerHTML = 'Success!';
        } else {
            replyDiv.innerHTML = `There was an error! Please enter a valid client ID: ${arg.error}`;
        }
    });
}
