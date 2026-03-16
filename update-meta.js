import fs from 'fs';

const filePath = 'src/services/metaWabaService.ts';
let content = fs.readFileSync(filePath, 'utf8');

const functionsToUpdate = [
  'async createTemplate(templateData: any) {',
  "async sendTemplateMessage(phone: string, templateName: string, languageCode: string = 'en', components: any[] = []) {",
  'async sendTextMessage(phone: string, text: string) {',
  'async getAccountInfo() {',
  'async getPhoneNumbers() {',
  'async getPhoneNumberDetail(wabaId: string, phoneNumber: string) {',
  'async getBusinessProfileAbout(wabaId: string, phoneNumber: string) {',
  'async updateBusinessProfile(wabaId: string, phoneNumber: string, data: any) {',
  'async updateBusinessProfilePhoto(wabaId: string, phoneNumber: string, file: File) {',
  'async getBusinessAccounts() {'
];

functionsToUpdate.forEach(func => {
  content = content.replace(
    func,
    `${func}\n    const { META_ACCESS_TOKEN, META_PHONE_NUMBER_ID, META_WABA_ID } = getMetaConfig();`
  );
});

fs.writeFileSync(filePath, content);
console.log('Updated metaWabaService.ts');
