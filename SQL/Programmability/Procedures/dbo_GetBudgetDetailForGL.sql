SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

-- =============================================
CREATE PROCEDURE [dbo].[GetBudgetDetailForGL]  --   exec GetBudgetDetailForGL 72,3
(
@BudgetFileID int,
@ProdID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    	declare @CategoryNumber1 varchar(50);
	declare @AccountNumber1 varchar(50);
	declare @Description1 varchar(50);
	declare @AccountCode1 varchar(50);
	declare @DetailCode1 varchar(50);
	declare @Available1 varchar(50);
	declare @OldValue varchar(50);
	declare @GlobalValue int;

	set @OldValue='';
	set @GlobalValue=0;
	declare @DetailNoID varchar(50);

	declare @temp table (CategoryNumber1 varchar(50),AccountNumber1 varchar(50),Description1 varchar(50),DetailCode varchar(50),Available varchar(50))


  declare ABC cursor for 

	select c.CategoryNumber,b.AccountNumber,a.Description, f.AccountCode as DetailCode, 'YES' as Available
 from budgetdetail a inner join BudgetAccounts b on a.Accountid=b.Accountid inner Join BudgetCategory c on b.CategoryId=c.Cid
Inner Join tblAccounts d on c.CategoryNumber=d.AccountCode and d.SegmentType='Ledger' inner Join tblaccounts e on e.AccountCode=b.AccountNumber and e.SegmentType='Detail'
and e.Sublevel=1
Inner Join tblAccounts f on f.AccountName=a.Description and f.SegmentType='Detail' and f.Sublevel>1
where f.ParentID=e.AccountId and e.ParentId=d.Accountid and a.BudgetFileID=@BudgetFileID and b.BudgetFileID=@BudgetFileID and c.BudgetFileID=@BudgetFileID

union all
(
select c.CategoryNumber,b.AccountNumber,a.Description,'' as  DetailCode, 'NO' as Available  from budgetdetail a 
inner join BudgetAccounts b on a.Accountid=b.Accountid inner Join BudgetCategory c on b.CategoryId=c.Cid
Inner Join tblAccounts d on c.CategoryNumber=d.AccountCode and d.SegmentType='Ledger' inner Join tblaccounts e on e.AccountCode=b.AccountNumber and e.SegmentType='Detail'
and e.Sublevel=1
where  e.ParentId=d.Accountid and a.BudgetFileID=@BudgetFileID and b.BudgetFileID=@BudgetFileID and c.BudgetFileID=@BudgetFileID)
order by c.CategoryNumber,b.AccountNumber ,DetailCode
	 
 open ABC;
fetch next from ABC into @CategoryNumber1,@AccountNumber1,@Description1,@DetailCode1, @Available1

while @@FETCH_STATUS = 0
begin

if(@OldValue='')
begin

set @OldValue=@AccountNumber1;
set @GlobalValue=@GlobalValue+1;

 if(@Available1='YES')
  begin
  insert into  @temp values(@CategoryNumber1,@AccountNumber1,@Description1, @DetailCode1,@Available1);
  end
  else
  begin
  select top 1 @DetailNoID= Number
from tblNumber
where Number in (select top (@GlobalValue) Number from tblNumber where Number not in (
select f.AccountCode 
 from budgetdetail a inner join BudgetAccounts b on a.Accountid=b.Accountid inner Join BudgetCategory c on b.CategoryId=c.Cid
Inner Join tblAccounts d on c.CategoryNumber=d.AccountCode and d.SegmentType='Ledger' inner Join tblaccounts e on e.AccountCode=b.AccountNumber and e.SegmentType='Detail'
and e.Sublevel=1
Inner Join tblAccounts f on f.AccountName=a.Description and f.SegmentType='Detail' and f.Sublevel>1
where f.ParentID=e.AccountId and e.ParentId=d.Accountid and a.BudgetFileID=@BudgetFileID and b.BudgetFileID=@BudgetFileID and c.BudgetFileID=@BudgetFileID
 and c.CategoryNumber=@CategoryNumber1 
and b.AccountNumber=@AccountNumber1
) order by Number asc)
order by Number desc;

insert into  @temp values(@CategoryNumber1,@AccountNumber1,@Description1, @DetailNoID,@Available1);
  end

end

else if(@OldValue=@AccountNumber1)
begin

set @OldValue=@AccountNumber1;
set @GlobalValue=@GlobalValue+1;

if(@Available1='YES')
  begin
  insert into  @temp values(@CategoryNumber1,@AccountNumber1,@Description1, @DetailCode1,@Available1);
  end
  else
  begin
  select top 1 @DetailNoID= Number
from tblNumber
where Number in (select top (@GlobalValue) Number from tblNumber where Number not in (
select f.AccountCode 
 from budgetdetail a inner join BudgetAccounts b on a.Accountid=b.Accountid inner Join BudgetCategory c on b.CategoryId=c.Cid
Inner Join tblAccounts d on c.CategoryNumber=d.AccountCode and d.SegmentType='Ledger' inner Join tblaccounts e on e.AccountCode=b.AccountNumber and e.SegmentType='Detail'
and e.Sublevel=1
Inner Join tblAccounts f on f.AccountName=a.Description and f.SegmentType='Detail' and f.Sublevel>1
where f.ParentID=e.AccountId and e.ParentId=d.Accountid and a.BudgetFileID=@BudgetFileID and b.BudgetFileID=@BudgetFileID and c.BudgetFileID=@BudgetFileID
 and c.CategoryNumber=@CategoryNumber1 
and b.AccountNumber=@AccountNumber1
) order by Number asc)
order by Number desc;

insert into  @temp values(@CategoryNumber1,@AccountNumber1,@Description1, @DetailNoID,@Available1);
  end

end

else 
begin

set @OldValue=@AccountNumber1;
set @GlobalValue=1;

if(@Available1='YES')
  begin
  insert into  @temp values(@CategoryNumber1,@AccountNumber1,@Description1, @DetailCode1,@Available1);
  end
  else
  begin
  select top 1 @DetailNoID= Number
from tblNumber
where Number in (select top (@GlobalValue) Number from tblNumber where Number not in (
select f.AccountCode 
 from budgetdetail a inner join BudgetAccounts b on a.Accountid=b.Accountid inner Join BudgetCategory c on b.CategoryId=c.Cid
Inner Join tblAccounts d on c.CategoryNumber=d.AccountCode and d.SegmentType='Ledger' inner Join tblaccounts e on e.AccountCode=b.AccountNumber and e.SegmentType='Detail'
and e.Sublevel=1
Inner Join tblAccounts f on f.AccountName=a.Description and f.SegmentType='Detail' and f.Sublevel>1
where f.ParentID=e.AccountId and e.ParentId=d.Accountid and a.BudgetFileID=@BudgetFileID and b.BudgetFileID=@BudgetFileID and c.BudgetFileID=@BudgetFileID
 and c.CategoryNumber=@CategoryNumber1 
and b.AccountNumber=@AccountNumber1
) order by Number asc)
order by Number desc;

insert into  @temp values(@CategoryNumber1,@AccountNumber1,@Description1, @DetailNoID,@Available1);
  end

end

fetch next from ABC into @CategoryNumber1,@AccountNumber1,@Description1,@DetailCode1, @Available1
end
close ABC;
deallocate ABC;

select a.CategoryNumber1 ,a.AccountNumber1 ,a.Description1, a.DetailCode , a.Available,b.AccountId as ParentID  from @temp as a inner join TblAccounts as b on 
a.AccountNumber1=b.AccountCode 
order by a.AccountNumber1 ,a.DetailCode

END




GO