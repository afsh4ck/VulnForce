import type { Client } from './types';
import { CLIENT_LOGOS } from './client-logos';

export const initialClients: Client[] = [
  { id: 'cli-htb', name: 'Hack The Box', contact: 'contact@hackthebox.eu', phone: '+1-202-555-0182', logoUrl: CLIENT_LOGOS['cli-htb'] },
  { id: 'cli-ine', name: 'INE Security', contact: 'security@ine.com', phone: '+1-202-555-0182', logoUrl: CLIENT_LOGOS['cli-ine'] },
  { id: 'cli-offsec', name: 'Offsec', contact: 'audit@offsec.com', phone: '+1-202-555-0182', logoUrl: CLIENT_LOGOS['cli-offsec'] },
  { id: 'cli-h4ck', name: 'h4ckercademy', contact: 'info@h4ckercademy.com', phone: '+1-202-555-0182', logoUrl: '/client-logos/h4ckercademy.png' },
  { id: 'cli-trilocor', name: 'Trilocor Robotics', contact: 'security@trilocor-robotics.com', phone: '+1-202-555-0184', logoUrl: '/client-logos/trilocor-robotics.png' },
];
