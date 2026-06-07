import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject, Observable } from 'rxjs';

export interface ProductPayload {
  name: string;
  price: number;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private hubConnection!: signalR.HubConnection;
  
  // TODO: Create a Subject to emit product updates to listening components
  private productAddedSource = new Subject<ProductPayload>();
  public productAdded$: Observable<ProductPayload> = this.productAddedSource.asObservable();

  public startConnection(): void {
    // TODO: Build the hub connection pointing to the backend's catalog hub (e.g. https://localhost:5001/hubs/catalog)
    // Configure automatic reconnection.
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:5001/hubs/catalog')
      .withAutomaticReconnect()
      .build();

    // TODO: Start the connection and register log handlers
    this.hubConnection
      .start()
      .then(() => console.log('SignalR: Connected to Catalog Hub'))
      .catch(err => console.error('SignalR: Error establishing connection: ', err));

    // TODO: Listen for "ProductAdded" events and pass the payload to the Subject
    this.hubConnection.on('ProductAdded', (payload: ProductPayload) => {
      this.productAddedSource.next(payload);
    });
  }

  public stopConnection(): void {
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
  }
}
