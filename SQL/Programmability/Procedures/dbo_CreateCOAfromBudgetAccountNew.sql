SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO


CREATE PROCEDURE [dbo].[CreateCOAfromBudgetAccountNew]
(
@BAIString varchar(500),
@BudgetFileID int,
@Prodid int,
@CreatedBy int
)
AS
BEGIN

    declare @StrVal varchar(100);
	declare @CategoryNumber varchar(100);
	declare @AccountNumber varchar(100);
	declare @AccountDescription varchar(500);
	declare @AccID int;
	declare @COAIDD int;
	declare @BudgetAccountID int;
	declare @DTLevel int;

	select @DTLevel=SegmentLevel from Segment where ProdId=@Prodid and Classification='Detail';

	declare @S1 varchar(100);
	declare @S2 varchar(100);
	declare @S3 varchar(100);
	declare @S4 varchar(100);
	declare @S5 varchar(100);
	declare @S6 varchar(100);
	declare @S7 varchar(100);
	declare @S8 varchar(100);

	SELECT @S1=s1,@S2=s2,@S3=s3,@S4=s4,@S5=s5,@S6=s6, @StrVal=SegStr1 FROM BudgetFile where BudgetFileID=@BudgetFileID;
	set @s7='';
	set @s8='';


	--select @CateNum=b.CategoryNumber from BudgetCategory 
	--where  Budgetfileid=@BudgetFileID and BudgetCategoryID=@BCI;


    DECLARE Cus_Category CURSOR FOR 
    select b.CategoryNumber,a.AccountNumber,a.AccountDesc,a.BudgetAccountID from BudgetAccounts as a inner join BudgetCategory as b 
	on a.CategoryId=b.cid where a.BudgetAccountID in
	 (SELECT items as S1 FROM dbo.SplitId(@BAIString,',')) and a.BudgetFileID=@BudgetFileID and b.BudgetFileID=@BudgetFileID
	
     open Cus_Category;
     fetch next from Cus_Category into @CategoryNumber,@AccountNumber,@AccountDescription,@BudgetAccountID

    while @@FETCH_STATUS = 0
    begin

	SET NOCOUNT ON;


	if exists(select AccountId from TblAccounts where AccountCode=@AccountNumber
	 and SegmentType='Detail' and SubLevel=2 and ProdId=@Prodid)
	begin

	select @AccID=AccountId ,@AccountDescription=AccountName from TblAccounts
	 where AccountCode=@AccountNumber and SegmentType='Detail' and SubLevel=2 and ProdId=@Prodid

    end
     else
    begin
	  declare @SegmentID int;
	  declare @ParentID int;

	  select @ParentID=isnull(AccountId,0) from TblAccounts where AccountCode=@CategoryNumber and ProdId=@Prodid;

	  select @SegmentID=SegmentId from Segment where Classification='Detail' and ProdId=@Prodid

	insert into TblAccounts (AccountTypeId,SegmentId,AccountCode,AccountName,Status,Posting,SubLevel,SegmentType,ParentId,CreatedDate,CreatedBy,ProdId)
	values(6,@SegmentID,@AccountNumber,@AccountDescription,1,1,2,'Detail',@ParentID,CURRENT_TIMESTAMP,@CreatedBy,@Prodid)

	set @AccID=@@IDENTITY;


    end


	if(@DTLevel=2)
	begin
	set @S2=@CategoryNumber;

	end
	else if(@DTLevel=3)
	begin
	set @S3=@CategoryNumber+'>'+@AccountNumber;
	end
	else if(@DTLevel=4)
	begin
	set @S4=@CategoryNumber+'>'+@AccountNumber;
	end
	else if(@DTLevel=5)
	begin
	set @S5=@CategoryNumber+'>'+@AccountNumber;
	end
	else if(@DTLevel=6)
	begin
	set @S6=@CategoryNumber+'>'+@AccountNumber;
	end
	else if(@DTLevel=7)
	begin
	set @S7=@CategoryNumber+'>'+@AccountNumber;
	end
	else if(@DTLevel=8)
	begin
	set @S7=@CategoryNumber+'>'+@AccountNumber;
	end

	insert into COA (COACode,ParentCode,ProdId,DetailLevel,AccountId,Description,SS1,SS2,SS3,SS4,SS5,SS6,SS7,SS8) values
	(@StrVal+'|'+@CategoryNumber+'>'+@AccountNumber, @StrVal,@Prodid,2,@AccID,'',@S1,@S2,@S3,@S4,@S5,@S6,@S7,@S8)

	set @COAIDD=@@IDENTITY;

	update BudgetAccounts set COAID=@COAIDD where BudgetAccountID=@BudgetAccountID

	--select * from COA
	--select * from TblAccounts
	--select * from Segment
	
   fetch next from Cus_Category into @CategoryNumber,@AccountNumber,@AccountDescription,@BudgetAccountID

	   end
        end
       CLOSE Cus_Category
     DEALLOCATE Cus_Category

	 select 1;




GO