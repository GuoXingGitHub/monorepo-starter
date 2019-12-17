// สถานะการเผยแพร่บทความ
export enum EPublishState {
  Draft = '0', // แก้ไข
  Published = '1', // เผยแพร่
  Recycle = '-1', // อยู่ในถังขยะ
}

// สถานะบทความหลังจากเผยแพร่
export enum EPublicState {
  Password = '0', // ใส่รหัสผ่าน
  Public = '1', // สาธารณะ
  Secret = '-1', // ความลับ
}
