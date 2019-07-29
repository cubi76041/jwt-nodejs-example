import { MigrationInterface, QueryRunner, getRepository } from 'typeorm';
import { User, UserRole } from '../entities/User';

export class AddFirstUserMigration1564132990939 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const user = new User();
    user.email = 'test@example.com';
    user.password = '123456';
    user.firstName = 'Test';
    user.lastName = 'Example';
    user.age = 27;
    user.role = UserRole.ADMIN;
    user.hashPassword();

    const userRepo = getRepository(User);
    await userRepo.save(user);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
