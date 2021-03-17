import { ipcRenderer } from 'electron';

const form: HTMLFormElement = document.querySelector('#rpcForm')!;
form.addEventListener('submit', submitForm);
form.addEventListener('reset', resetForm);

function submitForm(e: Event) {
    e.preventDefault();

    const newPresence: Record<string, unknown> = {};

    const children: NodeListOf<HTMLInputElement> = form.querySelectorAll(
        'input[type="text"], input[type="checkbox"]'
    );

    children.forEach((child: HTMLInputElement) => {
        switch (child.type) {
            case 'text':
                if (child.value !== '' && !child.id.startsWith('button')) {
                    newPresence[child.id] = child.value;
                }

                break;
            case 'checkbox':
                if (child.checked) {
                    newPresence.startTimestamp = new Date();
                } else {
                    newPresence.startTimestamp = null;
                }

                break;
        }
    });

    const buttonDiv: HTMLDivElement = document.querySelector('#buttons')!;
    const buttonDivInputs: NodeListOf<HTMLInputElement> = buttonDiv.querySelectorAll(
        'input[type="text"]'
    );

    newPresence.buttons = concatButtons(buttonDiv, buttonDivInputs);

    ipcRenderer.send('doUpdatePresence', newPresence);
}

ipcRenderer.on('asynchronous-reply', () => {
    sendReply(true, 'RPC successfully set! It may take some time for the changes to appear...');
});

function concatButtons(
    buttonDiv: HTMLDivElement,
    buttonDivInputs: NodeListOf<HTMLInputElement>
): Array<{ label: string; url: string }> {
    const buttons: Array<{ label: string; url: string }> = [];

    for (let i = 1; i <= buttonDivInputs.length / 2; i++) {
        const tempLabel: HTMLInputElement = buttonDiv.querySelector(`#button${i}Label`)!;
        const tempUrl: HTMLInputElement = buttonDiv.querySelector(`#button${i}Url`)!;

        if (!(tempLabel.value === '' && tempUrl.value === '')) {
            if (tempLabel.value === '' || tempUrl.value === '') {
                sendReply(
                    true,
                    'Your buttons were not included because you have to provide a name and URL!'
                );
            } else {
                if (!tempUrl.value.startsWith('http://') && !tempUrl.value.startsWith('https://')) {
                    tempUrl.value = 'https://' + tempUrl.value;
                }

                const tempButton: { label: string; url: string } = {
                    label: tempLabel.value,
                    url: tempUrl.value
                };

                buttons.push(tempButton);
            }
        }
    }

    return buttons;
}

function sendReply(temp: boolean, input: string) {
    const replyDiv: HTMLDivElement = document.querySelector('#reply')!;

    replyDiv.innerHTML = input;

    if (temp) {
        setTimeout(() => {
            replyDiv.innerHTML = '';
        }, 4e3);
    }
}

function resetForm(e: Event) {
    e.preventDefault();

    ipcRenderer.send('destroyRpc');

    ipcRenderer.on('asynchronous-reply', (event, arg) => {
        if (arg.success === true) {
            sendReply(false, 'Sucessfully reset the client! Redirecting to the client ID page...');
        } else {
            sendReply(false, `There was an error! Please manually restart the app: ${arg.error}`);
        }
    });
}
