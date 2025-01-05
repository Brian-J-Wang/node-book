### Currently Known Tech Debts
1. logic for determining whether a item node is a frontier node is currently located in item-node-validator. Could possibly put it somewhere else
2. logic for whether updating the react side of things is borked right now. Currently vaidation for the entire graph is done every time the react state is updated
3. Edges rerender too quickly even if it is just the mouse moving