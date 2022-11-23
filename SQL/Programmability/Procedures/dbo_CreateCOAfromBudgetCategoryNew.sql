SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[CreateCOAfromBudgetCategoryNew]
(
@BCIString varchar(500),
@BudgetFileID int,
@Prodid int,
@CreatedBy int
)
AS
BEGIN

    declare @StrVal varchar(100);
	declare @CategoryNumber varchar(100);
	declare @CategoryDescription varchar(500);
	declare @BudgetCategoryID int;
	declare @AccID int;
	declare @COAIDD int;
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
    DECLARE Cus_Category CURSOR FOR 
    select CategoryNumber,CategoryDescription,BudgetCategoryID from BudgetCategory where BudgetCategoryID in
	 (SELECT items as S1 FROM dbo.SplitId(@BCIString,',')) and Budgetfileid=@BudgetFileID
	
     open Cus_Category;
     fetch next from Cus_Category into @CategoryNumber,@CategoryDescription,@BudgetCategoryID

    while @@FETCH_STATUS = 0
    begin

	SET NOCOUNT ON;


	if exists(select AccountId from TblAccounts where AccountCode=@CategoryNumber and SegmentType='Detail' and SubLevel=1 and ProdId=@Prodid)
	begin

	select @AccID=AccountId ,@CategoryDescription=AccountName from TblAccounts where AccountCode=@CategoryNumber and SegmentType='Detail' and SubLevel=1 and ProdId=@Prodid

    end
     else
    begin
	  declare @SegmentID int;

	  select @SegmentID=SegmentId from Segment where Classification='Detail' and ProdId=@Prodid

	insert into TblAccounts (SegmentId,AccountCode,AccountTypeId,AccountName,Status,Posting,SubLevel,SegmentType,ParentId,CreatedDate,CreatedBy,ProdId)
	values(@SegmentID,@CategoryNumber,6,@CategoryDescription,1,1,1,'Detail',0,CURRENT_TIMESTAMP,@CreatedBy,@Prodid)

	set @AccID=@@IDENTITY;


    end

	
	if(@DTLevel=2)
	begin
	set @S2=@CategoryNumber;

	end
	else if(@DTLevel=3)
	begin
	set @S3=@CategoryNumber;
	end
	else if(@DTLevel=4)
	begin
	set @S4=@CategoryNumber;
	end
	else if(@DTLevel=5)
	begin
	set @S5=@CategoryNumber;
	end
	else if(@DTLevel=6)
	begin
	set @S6=@CategoryNumber;
	end
	else if(@DTLevel=7)
	begin
	set @S7=@CategoryNumber;
	end
	else if(@DTLevel=8)
	begin
	set @S7=@CategoryNumber;
	end



	insert into COA (COACode,ParentCode,Description,ProdId,DetailLevel,AccountId,SS1,SS2,SS3,SS4,SS5,SS6,SS7,SS8) values
	(@StrVal+'|'+@CategoryNumber, @StrVal,'',@Prodid,1,@AccID,@S1,@S2,@S3,@S4,@S5,@S6,@S7,@S8)

	set @COAIDD=@@IDENTITY;

	update BudgetCategory set COAID=@COAIDD where BudgetCategoryID=@BudgetCategoryID
	
	
   fetch next from Cus_Category into @CategoryNumber,@CategoryDescription,@BudgetCategoryID

	   end
        end
       CLOSE Cus_Category
     DEALLOCATE Cus_Category

	 select 1;




GO