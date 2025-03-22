# Getting Started with Create React App

OPENAI_API_KEY=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

codigo arduino
const int ECG_PIN = A0;

const int BUFFER_SIZE = 10;
int buffer[BUFFER_SIZE];
int bufferIndex = 0;

const int MIN_VALID = 50;
const int MAX_VALID = 250;
int THRESHOLD = 520;

unsigned long lastBeat = 0;
int bpm = 0;

void setup() {
  Serial.begin(9600);
  pinMode(ECG_PIN, INPUT);

  for (int i = 0; i < BUFFER_SIZE; i++) buffer[i] = 0;
}

void loop() {
  int rawValue = analogRead(ECG_PIN);

  // Media móvil
  buffer[bufferIndex] = rawValue;
  bufferIndex = (bufferIndex + 1) % BUFFER_SIZE;

  int sum = 0;
  for (int i = 0; i < BUFFER_SIZE; i++) sum += buffer[i];
  int filteredValue = sum / BUFFER_SIZE;

  // Umbral adaptativo
  THRESHOLD = filteredValue + 20;

  // Mapear y limitar
  int mappedValue = map(filteredValue, 400, 600, MIN_VALID, MAX_VALID);
  mappedValue = constrain(mappedValue, MIN_VALID, MAX_VALID);

  // Enviar solo el valor mapeado
  Serial.print(mappedValue);

  // Detección de latido
  if (filteredValue > THRESHOLD && millis() - lastBeat > 600) { // ahora espera mínimo 600ms
    unsigned long currentTime = millis();
    bpm = 60000 / (currentTime - lastBeat);
    lastBeat = currentTime;

    if (bpm > 40 && bpm < 180) {
      Serial.print(",");
      Serial.print(bpm); // Solo los números, separados por coma
    }
  }

  Serial.println(); // Cada línea será como: 130 ó 145,72
  delay(5);
}


This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
