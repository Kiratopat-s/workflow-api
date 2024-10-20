import { Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { Repository } from 'typeorm';


@Injectable()
export class ItemsService {

  constructor(
    @InjectRepository(Item) private itemRepository: Repository<Item>
  ) { }

  /**
   * Insert new item to database
   * @author Kiratipat
   * @date 2024-10-20
   * @param {CreateItemDto} createItemDto
   * @returns {Item}
   */
  create(createItemDto: CreateItemDto) {
    return this.itemRepository.save(createItemDto);
  }

  /**
   * List all items in database DESC order by id
   * @author Kiratipat
   * @date 2024-10-20
   * @returns {Item[]}
   */
  findAll() {
    return this.itemRepository.find({
      order: {
        id: 'DESC'
      }
    });
  }

  /**
   * Find one item by id in database
   * @author Kiratipat
   * @date 2024-10-20
   * @param {number} id
   * @returns {Item}
   */
  findOne(id: number) {
    return this.itemRepository.findOneBy({ id });
  }

  // /**
  //  * Update item by id in database
  //  * @author Kiratipat
  //  * @date 2024-10-20
  //  * @param {any} id:number
  //  * @param {any} updateItemDto:UpdateItemDto
  //  * @returns {UpdateResult}
  //  */
  // update(id: number, updateItemDto: UpdateItemDto) {
  //   return this.itemRepository.update(id, updateItemDto);
  // }

  /**
   * Update item by id in database
   * @author Kiratipat
   * @date 2024-10-20
   * @param {number} id
   * @param {UpdateItemDto} updateItemDto
   * @returns {id, UpdateItemDto}
   */
  update(id: number, updateItemDto: UpdateItemDto) {
    return this.itemRepository.save({
      id, ...updateItemDto
    })
  }

  /**
   * Description
   * @author Kiratipat
   * @date 2024-10-20
   * @param {any} id:number
   * @returns {DeleteResult}
   */
  remove(id: number) {
    return this.itemRepository.delete(id);
  }
}