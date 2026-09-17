// this, is the main file thing yay and yes
import {createClient, type MatrixClient} from "matrix-js-sdk"
import { saveSession } from "./session"

const HOMESERVER =  "https://matrix-client.matrix.org";
let client: MatrixClient | undefined;

export const login = async (username: string, password: string): Promise<void> => {

const tempClient = createClient({baseUrl: HOMESERVER})
const response = await tempClient.loginRequest({type: "m.login.password", identifier: {type: "m.id.user", user: username}, password, initial_device_display_name: "goobchat"});
const session = {
		accessToken: response.access_token,
		deviceId: response.device_id,
		userId: response.user_id
	};
	await saveSession(session);
    client = createClient({baseUrl: HOMESERVER, accessToken: session.accessToken, userId: session.userId, deviceId: session.deviceId});

}
export const getClient = () => client;
