SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[EmptyBudget]
(

@uploadedby int,
@CompanCode nvarchar(20),
@prodid int,
@Budgetid int,
@S1 varchar(50),
@S2 varchar(50),
@S3 varchar(50),
@S4 varchar(50),
@S5 varchar(50),
@S6 varchar(50),
@S7 varchar(50),
@S8 varchar(50),
@LedgerLebel varchar(50),
@SegmentName varchar(500),
@SegStr1 varchar(500),
@SegStr2 varchar(500)
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

 Declare @CompanyID int;
	
	if exists(select CompanyID from company where CompanyCode=@CompanCode)
	begin
	select @CompanyID=CompanyID from company where CompanyCode=@CompanCode
	end
	else
	begin
	set @CompanyID=0;
	end
	

 insert into BudgetFile (Uploadeddate,uploadedby,Action,Status,LeaveexistingCOA,CompanCode,CompanyID,prodid,Budgetid,UploadedXML,S1,S2,S3,S4,S5,S6,LedgerLebel,SegmentName,SegStr1,SegStr2) values
                  (CURRENT_TIMESTAMP,@uploadedby,'Initial Upload','Saved',1,@CompanCode,@CompanyID,@prodid,@Budgetid,'',@S1,@S2,@S3,@S4,@S5,@S6,@LedgerLebel,@SegmentName,@SegStr1,@SegStr2)
				
 declare @BudgetFileID int;

 select @BudgetFileID=max(BudgetFileID) from BudgetFile ;


	 declare @SegStr varchar(100);
	 declare @SegStrCheck varchar(100);
	 declare @CCount int;
	 declare @ACount int;

	select @SegStr=SegStr1 from BudgetFile where Budgetfileid=@BudgetFileID and BudgetID=@BudgetID

	 
	   ------------insert Green Rows Category----------------------------------
			
  declare @maxid int ; 
  select @maxid=isnull(max(cid),0) from BudgetCategory where Budgetfileid=@BudgetFileID

  declare @StrBeforeDT varchar(200);
  select @StrBeforeDT=SegStr1 from BudgetFile where BudgetFileID=@BudgetFileID and prodid=@ProdID;


  insert into BudgetCategory(cid,CategoryNumber,CategoryDescription,CategoryFringe,CategoryOriginal,CategoryTotal,
  CategoryVariance,Budgetfileid,Createddate,createdby,BudgetID,S1,S2,S3,S4,S5,S6,S7,S8,COAID,COACODE)

   select (ROW_NUMBER() OVER (ORDER BY b.AccountCode))+@maxid,b.AccountCode,AccountName,
  '0','0','0','0' ,@BudgetFileID,CURRENT_TIMESTAMP,@uploadedby,@BudgetID,a.SS1,a.SS2,a.SS3,a.SS4,a.SS5,a.SS6,a.SS7,a.SS8,a.COAID, a.COACode
   from COA as a inner join TblAccounts as b on a.AccountId=b.AccountId
    where a.ProdId=@ProdID and a.COACode not in (select COACODE from BudgetCategory where
    Budgetfileid=@BudgetFileID and CategoryNumber  is not null  
	 )  and a.COACode like '%'+@StrBeforeDT+'|%' and a.DetailLevel=1 and isnull(a.AccountTypeid,0) not in (4,5)
    

	  ------------END Green Rows Category----------------------------------

	  -------------------------------Inseet Green ROW Accounts---------------------------------

	  declare @Categoryid int;
	  declare @CategoryNoo varchar(100);
	  declare @AccountID int;
	  declare @AccountNumber1 varchar(100);
	  declare @AccountDesc varchar(100);
	  declare @COACODE2 varchar(100);
	  declare @COAIDD int;


	   --declare @maxid int ; 
      

	   
    DECLARE Cus_Category1 CURSOR FOR 
   
  select distinct c.CategoryNumber,b.AccountCode,
b.AccountName ,a.COACode,a.COAID  from COA as a inner join TblAccounts as b on a.AccountId=b.AccountId
 inner join TblAccounts as d on b.ParentId=d.AccountId
inner join BudgetCategory as c on d.AccountCode=c.CategoryNumber
 where a.DetailLevel=2 and a.ProdId=@ProdID and c.Budgetfileid=@BudgetFileID and a.COACode like @SegStr+'|%'
 and a.COACode NOT in (select COACODE from BudgetAccounts where Budgetfileid=@BudgetFileID and COACode is not null)
 and isnull(a.AccountTypeid,0) not in (4,5)

	 
     open Cus_Category1;

     fetch next from Cus_Category1 into @CategoryNoo ,@AccountNumber1 ,@AccountDesc,@COACODE2,@COAIDD

     while @@FETCH_STATUS = 0
      begin

	    select @AccountID=isnull(max(AccountID),0) from BudgetAccounts where Budgetfileid=@BudgetFileID;
	    select @Categoryid=isnull(cid,0) from BudgetCategory where CategoryNumber=@CategoryNoo and Budgetfileid=@BudgetFileID;
		
		insert into BudgetAccounts(Categoryid,AccountID,AccountNumber,AccountDesc,AccountFringe,AccountOriginal,
		AccountTotal,AccountVariance,BudgetFileID,BudgetID,CreatedDate,CreatedBy,COAID,COACODE)
		values(@Categoryid,@AccountID+1,@AccountNumber1,@AccountDesc,0,0,0,0,@BudgetFileID,@BudgetID,CURRENT_TIMESTAMP,
		@uploadedby,@COAIDD,@COACODE2)

	  
	  
       fetch next from Cus_Category1 into @CategoryNoo ,@AccountNumber1 ,@AccountDesc,@COACODE2,@COAIDD	
	    end	
       CLOSE Cus_Category1
       DEALLOCATE Cus_Category1
	 

	  --------------------------------END GREEN ROW ACCOUNTS-------------------------------------------
	   exec InsertDataETCEFC @BudgetID,@BudgetFileID
	  ------insert Next All Level after 2----

	  select @BudgetFileID;
END



GO