import { BankAccount } from './entities/bank-account.entity';
import { Injectable } from '@nestjs/common';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BankAccountsService {

  constructor(
    @InjectRepository(BankAccount)
    private repo: Repository<BankAccount>
  ) { }

  async create(createBankAccountDto: CreateBankAccountDto) {
    const bankAccount = this.repo.create({
      account_number: createBankAccountDto.account_number,
      balance: 0,
    });
 
    await this.repo.insert(bankAccount);
    return bankAccount;
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: string) {
    return this.repo.findOneBy({ id });
  }

  
  async transfer(from:string, to: string, amount: number ){
    const fromAccount = await this.repo.findOneBy({ id: from});
    const toAccount = await this.repo.findOneBy({ id: to});

    fromAccount.balance -= amount;
    toAccount.balance += amount;

    this.repo.save(fromAccount);
    this.repo.save(toAccount);
  }


}
