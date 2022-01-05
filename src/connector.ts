import WalletConnect from "@walletconnect/client";
import QRCode from "qrcode";
import {UserFacingError} from "./error";

// Keep websocket connections alive in-memory
const connectors: {
  [key: string]: {
    connector: WalletConnect;
    chainId: number;
  };
} = {};

// TODO resolve parallel access issues

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
  chainId: number,
) {
  if (
    !connectors[userId] ||
    !connectors[userId].connector.connected ||
    connectors[userId].chainId !== chainId
  ) {
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
    await connector.connect({ chainId });
    if (connector.chainId !== chainId) {
      await connector.killSession();
      throw new UserFacingError(
        `Wallet not connected to the correct network. Please use the network`
        + ` with chain id \`${chainId}\``,
      );
    }
    await clearConnector(userId);
    connectors[userId] = { connector, chainId };
  } 
  return connectors[userId].connector;
}

export async function clearConnector(userId: string) {
  if (connectors[userId] && connectors[userId].connector.connected) {
    const connector = connectors[userId].connector;
    delete connectors[userId];
    await connector.killSession();
  }
}
