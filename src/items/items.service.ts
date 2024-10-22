import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Item, ItemStatus } from './entities/item.entity';
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
  async findOne(id: number): Promise<Item> {
    const item = await this.itemRepository.findOneBy({ id });
    if (!item) {
      throw new NotFoundException(`Item with id ${id} not found`);
    }
    return item;
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
   * Delete item by id in database or throw NotFoundException if not found id in database
   * @author Kiratipat
   * @date 2024-10-20
   * @param {number} id
   * @returns {Item}
   */
  async remove(id: number) {
    const item = await this.itemRepository.findOneBy({ id })
    if (!item) {
      throw new NotFoundException(`Not found: id=${id}`)
    }

    return this.itemRepository.delete({ id })
  }

  /**
   * Approve item by id in database
   * Or throw NotFoundException if not found id in database
   * Or id is empty, item is not found in database, item is already approved in database
   * @author Kiratipat
   * @date 2024-10-20
   * @param {number} id
   * @returns {Item}
   */
  async approve(id: number) {
    // id should not empty
    if (!id) {
      throw new NotFoundException(`id should not empty`)
    }

    // item should found
    const item = await this.itemRepository.findOneBy({ id })
    if (!item) {
      throw new NotFoundException(`not found: id={${id}}`)
    }

    // prepare items
    // const approveItem = {...item, status: ItemStatus.APPROVED}
    // return await this.itemRepository.save(approveItem)

    item.status = ItemStatus.APPROVED

    return await this.itemRepository.save(item)
  }
}