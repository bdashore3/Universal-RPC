import { ipcRenderer, shell } from 'electron';
import { sendReply } from './utils';

document?.addEventListener('click', handleClick);

function handleClick(event: MouseEvent) {
    const target = event.target as HTMLAnchorElement;

    if (target.tagName === 'A' && target.href.startsWith('http')) {
        event.preventDefault();
        shell.openExternal(target.href);
    }
}

const form: HTMLFormElement = document.querySelector('form')!;
form.addEventListener('submit', submitForm);

function submitForm(e: Event) {
    e.preventDefault();

    const clientId = (<HTMLInputElement>document.querySelector('#clientId')).value;

    console.log('sending!');
    ipcRenderer.send('register', clientId);

    ipcRenderer.on('asynchronous-reply', (event, arg) => {
        if (arg.success === true) {
            sendReply(false, false, 'Success!');
        } else {
            sendReply(
                true,
                false,
                `There was an error! Please enter a valid client ID: ${arg.error}`
            );
        }
    });
}
