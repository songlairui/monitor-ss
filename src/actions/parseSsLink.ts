export default function(str: string) {
  const content = Buffer.from(str.slice(5), 'base64').toString()
  const [method, password, server, server_port] = content.split(/[:@]/)
  return { method, password, server, server_port: +server_port }
}
