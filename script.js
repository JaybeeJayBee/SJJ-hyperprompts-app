document.addEventListener('DOMContentLoaded', () => {

    // Logic for the login form (on index.html)
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent the default form submission
            
            const emailInput = document.getElementById('email');
            const email = emailInput.value;

            // In this phase, we'll just redirect to the dashboard.
            if (email) {
                console.log(`Email entered: ${email}`);
                window.location.href = 'dashboard.html';
            }
        });
    }

    // Logic for the dashboard page (on dashboard.html)
    const briefInfoTextarea = document.getElementById('brief-info');
    const charCountSpan = document.getElementById('char-count');
    const promptForm = document.getElementById('prompt-form');
    
    if (briefInfoTextarea && charCountSpan) {
        // Update the character count on every keypress
        briefInfoTextarea.addEventListener('input', () => {
            const currentLength = briefInfoTextarea.value.length;
            charCountSpan.textContent = `${currentLength}/500`;
        });
    }

    if (promptForm) {
        promptForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const briefInfo = briefInfoTextarea.value;
            const encryptedPrompt = document.getElementById('encrypted-prompt').value;

            // Show a loading message
            const responseContainer = document.getElementById('response-container');
            const geminiResponse = document.getElementById('gemini-response');
            geminiResponse.textContent = "Processing your request... please wait.";
            responseContainer.style.display = 'block';

            // The URL for your live API Gateway endpoint
            const API_GATEWAY_URL = 'https://d9f4l66ocb.execute-api.us-east-2.amazonaws.com/V1';

            try {
                const response = await fetch(API_GATEWAY_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        brief_info: briefInfo,
                        encrypted_prompt: encryptedPrompt
                    })
                });

                if (!response.ok) {
                    throw new Error(`API response was not ok: ${response.status}`);
                }

                const data = await response.json();
                geminiResponse.textContent = data.response;

            } catch (error) {
                console.error('Error:', error);
                // Display the full error message on the page for debugging
                geminiResponse.textContent = `An error occurred: ${error.message}`;
            }
        });
    }

});
