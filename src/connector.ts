import WalletConnect from '@walletconnect/client';
import QRCode from "qrcode";
import { config } from "./config";

// Keep websocket connections alive in-memory
const connectors: { [key: string]: WalletConnect } = {};

/**
 * Attempts to create or retrieve a walletconnect connector for a userId. The
 * function does not resolve until the connection is created.
 *
 * @param userId The id of the user to create or retrieve the connector for
 *
 * @param handleQrCode Handles the QR code required to start the walletconnect
 * connection - it should show it to the user or something. This is called
 * before this function resolves.
 */
export async function getConnector(
  userId: string,
  handleQrCode: (buffer: Buffer) => void,
) {
  if (!connectors[userId] || !connectors[userId].connected) {
    const connector = new WalletConnect({
      bridge: "https://bridge.walletconnect.org",
      qrcodeModal: {
        open: async (uri: string) => {
          const buffer = await QRCode.toBuffer(uri);
          handleQrCode(buffer);
        },
        close: () => {},
      },
    });
    await connector.connect({ chainId: config.chainId });
    connectors[userId] = connector;
  } 
  return connectors[userId];
}

export async function clearConnector(userId: string) {
  if (connectors[userId] && connectors[userId].connected) {
    const connector = connectors[userId];
    delete connectors[userId];
    await connector.killSession();
  }
}
