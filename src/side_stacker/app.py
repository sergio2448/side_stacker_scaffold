import asyncio

import websockets
from socket_handler import SocketHandler


async def main():
    socket_handler = SocketHandler()
    async with websockets.serve(socket_handler.handle_messages, "", 8001):
        await asyncio.Future()  # run forever


if __name__ == "__main__":
    asyncio.run(main())
