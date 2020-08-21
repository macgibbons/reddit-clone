import { Migration } from '@mikro-orm/migrations';

export class Migration20200821220425 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" rename column "user_name" to "username";');
  }

}
